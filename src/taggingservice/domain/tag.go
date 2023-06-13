package domain

type Tag struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
}

type TagRepository interface {
	CreateTag(name string) (Tag, error)
}
