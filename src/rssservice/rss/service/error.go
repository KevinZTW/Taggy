package service

import "errors"

var ErrFeedNotFound = errors.New("RSS feed not found")
var ErrItemNotFound = errors.New("RSS item not found")
var ErrRepository = errors.New("repository error")
