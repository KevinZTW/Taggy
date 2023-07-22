package service

import "testing"

func TestNormalizeName(t *testing.T) {
	test := []struct {
		name     string
		expected string
	}{
		{"PostgreSQL", "postgresql"},
		{"Two Phase Commit", "two phase commit"},
	}

	for _, tt := range test {
		if actual := NormalizeName(tt.name); actual != tt.expected {
			t.Errorf("normalizeName(%s) = %s, expected %s", tt.name, actual, tt.expected)
		} else {
			t.Logf("normalizeName(%s) = %s, expected %s", tt.name, actual, tt.expected)
		}
	}
}
