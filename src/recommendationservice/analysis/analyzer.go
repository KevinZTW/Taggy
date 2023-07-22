package analysis

import (
	"context"
	"recommendationservice/domain"
	tagrepository "recommendationservice/tag/repository"
	tagservice "recommendationservice/tag/service"

	"github.com/yanyiwu/gojieba"
)

type Analyzer struct {
	jieba      *gojieba.Jieba
	tagMap     map[string]*domain.Tag
	tagService *tagservice.TagService
}

func NewAnalyzer() (*Analyzer, error) {
	tagSrv := tagservice.NewTagService(tagrepository.NewMongo())

	if tags, err := tagSrv.ListTags(context.Background()); err != nil {
		return nil, err
	} else {
		analyzer := &Analyzer{
			jieba: gojieba.NewJieba("./analysis/dict/jieba.dict.utf8", "./analysis/dict/hmm_model.utf8", "./analysis/dict/user.dict.utf8", "./analysis/dict/idf.utf8", "./analysis/dict/stop_words.utf8"),
			// jieba:      gojieba.NewJieba("./dict/jieba.dict.utf8", "./dict/hmm_model.utf8", "./dict/user.dict.utf8", "./dict/idf.utf8", "./dict/stop_words.utf8"),
			tagMap:     make(map[string]*domain.Tag),
			tagService: tagSrv,
		}

		for _, tag := range tags {
			analyzer.jieba.AddWordEx(tag.Name, 20000, "n")
			analyzer.tagMap[tag.NormalizedName] = tag
		}

		return analyzer, nil
	}
}

func (a *Analyzer) Close() {
	a.jieba.Free()
}

func (a *Analyzer) AnalyzeTags(text string) []*domain.Tag {
	tagNum := 20
	keywords := a.jieba.ExtractWithWeight(text, tagNum)

	res := []*domain.Tag{}
	for _, keyword := range keywords {
		if tag, ok := a.tagMap[tagservice.NormalizeName(keyword.Word)]; ok {
			res = append(res, tag)
		}
	}

	return res
}
