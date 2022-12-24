package store

import (
	"context"

	"github.com/moganbo0817/template_project/entity"
)

func (r *Repository) AddTask(
	ctx context.Context, db Execer, t *entity.Task,
) error {
	t.Created = r.Clocker.Now()
	t.Modified = r.Clocker.Now()
	sql := `INSERT INTO task (title, status, created, modified) VALUES (?, ?, ?, ?);`
	result, err := db.ExecContext(
		ctx, sql, t.Title, t.Status,
		t.Created, t.Modified,
	)
	if err != nil {
		return err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	t.ID = entity.TaskID(id)
	return nil
}

func (r *Repository) ListTasks(
	ctx context.Context, db Queryer,
) (entity.Tasks, error) {
	tasks := entity.Tasks{}
	sql := `SELECT id, title, status, created, modified FROM task;`
	if err := db.SelectContext(ctx, &tasks, sql); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *Repository) ListTask(
	ctx context.Context, db Queryer, id int64,
) (*entity.Task, error) {
	task := &entity.Task{}
	sql := `SELECT id, title, status, created, modified FROM task where id = ?;`
	if err := db.GetContext(ctx, task, sql, id); err != nil {
		return task, err
	}
	return task, nil
}

func (r *Repository) UpdateTask(
	ctx context.Context, db Execer, t *entity.Task,
) (int64, error) {
	t.Created = r.Clocker.Now()
	t.Modified = r.Clocker.Now()
	sql := `Update task set title =?,status=? where id = ?;`
	result, err := db.ExecContext(
		ctx, sql, t.Title, t.Status,
		t.ID,
	)
	if err != nil {
		return 0, err
	}
	num, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}
	return num, err
}

func (r *Repository) DeleteTask(
	ctx context.Context, db Execer, id int64,
) (int64, error) {
	sql := `Delete from task where id = ?;`
	result, err := db.ExecContext(
		ctx, sql, id,
	)
	if err != nil {
		return 0, err
	}
	num, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}
	return num, err
}
