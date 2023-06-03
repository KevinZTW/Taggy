package log

import (
	"os"
	"time"

	"github.com/sirupsen/logrus"
)

var (
	Logger *logrus.Logger
)

func init() {
	Logger = logrus.New()
	Logger.Level = logrus.DebugLevel
	Logger.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	Logger.Out = os.Stdout
}

func Infof(format string, args ...interface{}) {
	Logger.Infof(format, args...)
}

func Errorf(format string, args ...interface{}) {
	Logger.Errorf(format, args...)
}

func Debugf(format string, args ...interface{}) {
	Logger.Debugf(format, args...)
}

func Fatal(args ...interface{}) {
	Logger.Fatal(args...)
}
