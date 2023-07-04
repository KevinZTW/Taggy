package telementry

import (
	"context"
	"recommendationservice/log"
	"sync"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"

	"go.opentelemetry.io/otel/propagation"
	sdkresource "go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

var tp *sdktrace.TracerProvider
var tracer trace.Tracer

var resource *sdkresource.Resource
var initResourcesOnce sync.Once

// TODO: Add the metrics provider when otel API is stable

func Init() {
	tp = initTracerProvider()
	tracer = tp.Tracer("recommendationservice")
}

func Shutdown() {
	if err := tp.Shutdown(context.Background()); err != nil {
		log.Errorf("Error shutting down tracer provider: %v", err)
	}
}

func NewTracer() trace.Tracer {
	return tracer
}

func initTracerProvider() *sdktrace.TracerProvider {
	ctx := context.Background()

	// add the otlptracegrpc.WithInsecure() option so app outside docker network could make TLS connection, need to deep dive later
	exporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithInsecure())

	if err != nil {
		log.Fatalf("new otlp trace grpc exporter failed: %v", err)
	}
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(initResource()),
	)
	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
	return tp
}

// Resource is to represent the entity producing telemetry
func initResource() *sdkresource.Resource {
	initResourcesOnce.Do(func() {
		extraResources, _ := sdkresource.New(
			context.Background(),
			sdkresource.WithOS(),
			sdkresource.WithProcess(),
			sdkresource.WithContainer(),
			sdkresource.WithHost(),
		)
		resource, _ = sdkresource.Merge(
			sdkresource.Default(),
			extraResources,
		)
	})
	return resource
}
