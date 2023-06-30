package service

import "errors"

var ErrSourceNotFound = errors.New("RSS source not found")
var ErrItemNotFound = errors.New("RSS item not found")
var ErrRepository = errors.New("Repository error")
