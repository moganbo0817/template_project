package config

import (
	"github.com/caarlos0/env/v6"
)

type Config struct {
	Env        string `env:"TEMPLATE_PROJECT_ENV" envDefault:"dev"`
	Port       int    `env:"PORT" envDefault:"80"`
	DBHost     string `env:"TEMPLATE_PROJECT_DB_HOST" envDefault:"127.0.0.1"`
	DBPort     int    `env:"TEMPLATE_PROJECT_DB_PORT" envDefault:"33306"`
	DBUser     string `env:"TEMPLATE_PROJECT_DB_User" envDefault:"temp_project"`
	DBPassword string `env:"TEMPLATE_PROJECT_DB_PASSWORD" envDefault:"temp_project"`
	DBName     string `env:"TEMPLATE_PROJECT_DB_NAME" envDefault:"temp_project"`
	RedisHost  string `env:"TEMPLATE_PROJECT_REDIS_HOST" envDefault:"127.0.0.1"`
	RedisPort  int    `env:"TEMPLATE_PROJECT_REDIS_PORT" envDefault:"36379"`
}

func New() (*Config, error) {
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}
