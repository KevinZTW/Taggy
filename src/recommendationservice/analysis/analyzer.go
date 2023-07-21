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
			jieba:      gojieba.NewJieba(),
			tagMap:     make(map[string]*domain.Tag),
			tagService: tagSrv,
		}

		for _, tag := range tags {
			analyzer.jieba.AddWordEx(tag.Name, 20000, "n")
			analyzer.tagMap[tag.Name] = tag
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
		if tag, ok := a.tagMap[keyword.Word]; ok {
			res = append(res, tag)
		}
	}

	return res
}
