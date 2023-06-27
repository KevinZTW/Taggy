package service

import "errors"

var ErrSourceNotFound = errors.New("RSS source not found")
var ErrFeedNotFound = errors.New("RSS feed not found")
var ErrRepository = errors.New("Repository error")
