package admintool

import (
	"context"
	"recommendationservice/log"
	tagrepository "recommendationservice/tag/repository"
	tagservice "recommendationservice/tag/service"
	topicrepository "recommendationservice/topic/repository"
	topicservice "recommendationservice/topic/service"
)

var (
	TopicCareerKeyWords = []string{
		"職涯",
		"知識網",
	}
)

type AdminTool struct {
	TagService   *tagservice.TagService
	TopicService *topicservice.TopicService
}

func New() *AdminTool {
	tagSrv := tagservice.NewTagService(tagrepository.NewMongo())
	topicSrc := topicservice.NewTopicService(topicrepository.NewMongo(), tagSrv)

	return &AdminTool{
		TagService:   tagSrv,
		TopicService: topicSrc,
	}
}

func (a *AdminTool) AddTagsToBackendTopic() {
	topic, err := a.TopicService.GetTopicByID("e7c95409-be1c-44c7-8ad0-fd6c94130545", context.Background())

	if err != nil {
		panic(err)
	}

	log.Infof("topic: %+v", topic)

	//TODO: Break these tags to different topics
	//TODO: I need a better way to manage and add these tags...

	keywords := []string{
		"後端",
		"後端工程師",
		"系統監測",
		"分散式",
		"作業系統",
		"分散式系統",
		"大型系統",
		"架構",
		"架構師",
		"微服務",
		"設計",
		"一至性",
		"網路",
		"網路安全",
		"網路協定",
		"網路架構",
		"快取",
		"資料庫",
		"資料庫設計",
		"API",
		"K8S",
		"Kubernetes",
		"Kafka",
		"Zipkin",
		"Prometheus",
		"Redis",
		"Mongo",
		"Postgres",
		"MySQL",
		"pg",
		"Pod",
		"cdn",
		//Language
		"Golang",
		"Go",
		"python",
		"Java",
		"C#",
		"C++",
		"PHP",
		"Ruby",
		"Scala",
		"Rust",
		"Kotlin",

		//operating system
		"linux",
		"thread",
		"process",
		"process scheduling",
		"process synchronization",
		"process management",
		"虛擬化",
		"虛擬機",
		"virtualization",
		"virtual machine",
		"container",
		"容器",
		"containerization",

		//Cloud
		"replication",
		"cloud",
		"aws",
		"azure",
		"google cloud",

		//software pattern
		"物件",
		"物件導向",
		"OOP",
		"程式設計",
		"設計模式",
		"Design Patterns",
		"Patterns",
		"Singleton",
		"Factory",
		"Abstract Factory",
		"Builder",
		"Prototype",
		"Adapter",
		"Bridge",
		"Composite",
		"Decorator",
		"Facade",
		"Flyweight",
		"Proxy",
		"Chain of Responsibility",
		"Command",
		"Interpreter",
		"Iterator",
		"Mediator",
		"Memento",
		"Observer",
		"State",
		"Strategy",
		"Template Method",
		"Model-View-Controller",
		"MVC",
		"Single Responsibility",
		"Open/Closed",
		"Liskov Substitution",
		"Interface Segregation",
		"Dependency Inversion",
		"Dependency Injection",
		//software engineering
		"Refactoring",
		// CICD
		"CI",
		"CD",
		"DevOps",
		"GitHub",
		"GitLab",
		"Jenkins",
		"Travis",
		"CircleCI",

		//API
		"RESTful",

		// testing
		"測試",
		"單元測試",
		"整合測試",
		"自動化測試",
		"測試工程師",
		"測試架構",
		"測試框架",
		"驗證",
		//others
		"UUID",
		"Token",
		"JWT",
		"OAuth",
		"JSON",
		"ACID",
		"CAP",
		"資料一致性",
		"Eventual Consistency",
		"Two-Phase Commit",
		"Consistency",
		"Consensus",
	}

	for _, keyword := range keywords {
		tag, err := a.TagService.CreateTag(keyword, nil)
		if err == tagservice.ErrTagAlreadyExists {
			log.Infof("tag %s already exists", keyword)
		} else if err != nil {
			panic(err)
		}
		if topic, err := a.TopicService.AddTagToTopic(tag.ID, topic.ID, context.Background()); err != nil {
			log.Errorf("failed to add tag %s to topic %s", tag.ID, err)
		} else {
			log.Infof("topic: %+v", topic)
		}

	}
}
