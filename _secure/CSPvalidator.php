<?php

declare(strict_types=1);

final class CSPValidator
{
    private array $catalog;
    private array $diagnostics = [];

    public function __construct(?array $catalog = null)
    {
        $this->catalog = $catalog ?? require __DIR__ . '/CSPcatalog.php';
    }

    public function sanitize(array $policy): array
    {
        $this->diagnostics = [];
        $directives = $this->directiveIndex();
        $sanitized = [];

        foreach ($policy as $name => $values) {
            if (!is_string($name)) {
                $this->diagnostics[] = 'Removed a directive with a non-string name.';
                continue;
            }

            $name = strtolower(trim($name));

            if (!isset($directives[$name])) {
                $this->diagnostics[] = "Removed unknown directive: {$name}.";
                continue;
            }

            if (array_key_exists($name, $sanitized)) {
                $this->diagnostics[] = "Removed duplicate directive: {$name}.";
                continue;
            }

            $syntax = $directives[$name];

            if ($syntax === 'valueless') {
                if ($values !== [] && $values !== null && $values !== '') {
                    $this->diagnostics[] = "Removed unexpected values from {$name}.";
                }

                $sanitized[$name] = [];
                continue;
            }

            if (!is_array($values)) {
                $this->diagnostics[] = "Removed invalid value container from {$name}.";
                continue;
            }

            $clean = [];
            foreach ($values as $value) {
                if (!is_string($value)) {
                    $this->diagnostics[] = "Removed a non-string value from {$name}.";
                    continue;
                }

                $value = trim($value);
                if ($value === '' || preg_match('/[\x00-\x20\x7F;]/', $value)) {
                    $this->diagnostics[] = "Removed malformed value from {$name}.";
                    continue;
                }

                if ($this->isValidValue($syntax, $value)) {
                    $clean[] = $value;
                } else {
                    $this->diagnostics[] = "Removed invalid value from {$name}: {$value}.";
                }
            }

            $clean = array_values(array_unique($clean));

            if (in_array("'none'", $clean, true) && count($clean) > 1) {
                $clean = array_values(array_filter($clean, static fn (string $value): bool => $value !== "'none'"));
                $this->diagnostics[] = "Removed 'none' from {$name} because other values are present.";
            }

            if ($clean === [] && in_array($syntax, ['source-list', 'ancestor-list'], true)) {
                $clean = ["'none'"];
                $this->diagnostics[] = "Restricted empty source list {$name} to 'none'.";
            }

            $sanitized[$name] = $clean;
        }

        return $sanitized;
    }

    public function serialize(array $policy): string
    {
        $parts = [];

        foreach ($this->sanitize($policy) as $name => $values) {
            $parts[] = $name . ($values === [] ? '' : ' ' . implode(' ', $values));
        }

        return implode('; ', $parts);
    }

    public function getDiagnostics(): array
    {
        return $this->diagnostics;
    }

    private function directiveIndex(): array
    {
        $index = [];

        foreach ($this->catalog['syntax'] as $syntax => $names) {
            foreach ($names as $name) {
                $index[$name] = $syntax;
            }
        }

        return $index;
    }

    private function isValidValue(string $syntax, string $value): bool
    {
        return match ($syntax) {
            'source-list', 'ancestor-list' => $this->isSourceExpression($value),
            'sandbox-flags' => in_array($value, $this->catalog['sandbox-flags'], true),
            'reporting-group' => (bool) preg_match('/^[A-Za-z0-9._-]+$/D', $value),
            'report-uri' => $this->isUriReference($value),
            'trusted-types-policies' => $this->isTrustedTypesPolicy($value),
            'trusted-types-sinks' => in_array($value, $this->catalog['trusted-types']['require-sinks'], true),
            'mime-types' => (bool) preg_match('~^[A-Za-z0-9!#$&^_.+-]+/[A-Za-z0-9!#$&^_.+-]+$~D', $value),
            'legacy-referrer' => in_array($value, $this->catalog['legacy-values']['referrer'], true),
            'legacy-reflected-xss' => in_array($value, $this->catalog['legacy-values']['reflected-xss'], true),
            'legacy-sri' => in_array($value, $this->catalog['legacy-values']['require-sri-for'], true),
            'webrtc-mode' => in_array($value, $this->catalog['experimental-values']['webrtc-src'], true),
            default => false,
        };
    }

    private function isSourceExpression(string $value): bool
    {
        if (in_array($value, $this->allSourceKeywords(), true) || $value === '*') {
            return true;
        }

        if (in_array(strtolower($value), $this->catalog['schemes'], true)) {
            return true;
        }

        if (preg_match('/^nonce-([A-Za-z0-9+\/_-]+={0,2})$/D', $value, $match)) {
            return base64_decode(strtr($match[1], '-_', '+/'), true) !== false;
        }

        if (preg_match('/^(sha256|sha384|sha512)-([A-Za-z0-9+\/_-]+={0,2})$/D', $value, $match)) {
            $decoded = base64_decode(strtr($match[2], '-_', '+/'), true);
            $length = ['sha256' => 32, 'sha384' => 48, 'sha512' => 64][$match[1]];
            return $decoded !== false && strlen($decoded) === $length;
        }

        if (preg_match('/^([a-z][a-z0-9+.-]*):$/iD', $value)) {
            return true;
        }

        return $this->isHostSource($value);
    }

    private function isHostSource(string $value): bool
    {
        return (bool) preg_match(
            '~^(?:(https?|wss?|ftp)://)?(?:\*\.)?(?:\[[0-9a-f:]+\]|(?:\*|[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?))(?::(?:\*|[0-9]{1,5}))?(?:/[^\s]*)?$~iD',
            $value
        );
    }

    private function isUriReference(string $value): bool
    {
        if (preg_match('/^[a-z][a-z0-9+.-]*:/i', $value)) {
            return filter_var($value, FILTER_VALIDATE_URL) !== false;
        }

        return str_starts_with($value, '/') && !str_starts_with($value, '//');
    }

    private function isTrustedTypesPolicy(string $value): bool
    {
        return in_array($value, $this->catalog['trusted-types']['keywords'], true)
            || (bool) preg_match('/^[A-Za-z0-9#=_/@.%:-]+$/D', $value);
    }

    private function allSourceKeywords(): array
    {
        return array_merge(
            $this->catalog['source-keywords']['common'],
            $this->catalog['source-keywords']['script'],
            $this->catalog['source-keywords']['script-style']
        );
    }
}
