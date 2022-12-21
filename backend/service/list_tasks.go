package service

import (
	"context"
	"fmt"

	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/store"
)

type ListTasks struct {
	DB   store.Queryer
	Repo TaskListers
}

func (l *ListTasks) ListTasks(ctx context.Context) (entity.Tasks, error) {
	ts, err := l.Repo.ListTasks(ctx, l.DB)
	if err != nil {
		return nil, fmt.Errorf("failed to list: %w", err)
	}
	return ts, nil
}
