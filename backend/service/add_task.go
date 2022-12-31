package service

import (
	"context"
	"fmt"

	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/store"
)

type AddTask struct {
	DB   store.Beginner
	Repo TaskAdder
}

func (a *AddTask) AddTask(ctx context.Context, title string) (*entity.Task, error) {
	t := &entity.Task{
		Title:  title,
		Status: entity.TaskStatusTodo,
	}
	err := a.Repo.AddTask(ctx, a.DB, t)
	if err != nil {
		return nil, fmt.Errorf("failed to register: %w", err)
	}
	return t, nil
}
