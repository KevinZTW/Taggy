package analysis

import "testing"
import "github.com/joho/godotenv"

func init() {
	//  for local testing, read the .env file in root directory
	godotenv.Load("../.env")
}
func TestAnalyze(t *testing.T) {
	t.Run("should return empty slice when text is empty", func(t *testing.T) {
		analyzer, _ := New()
		result := analyzer.AnalyzeTags("This is the test text 後端 工程師喜歡作業系統 operating system 唱歌 唱歌 後端 Zipkin Operating System 網路安全")
		if len(result) == 0 {
			t.Errorf("expected several tags but got nil")
		} else {
			t.Logf("result: %+v", result)
		}
	})
}
