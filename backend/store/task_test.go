package store

import (
	"context"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/moganbo0817/template_project/clock"
	"github.com/moganbo0817/template_project/entity"
	"github.com/moganbo0817/template_project/testutil"
)

func prepareTasks(ctx context.Context, t *testing.T, con Execer) (entity.Tasks, int64) {
	t.Helper()
	// DELETEもこれでいける
	if _, err := con.ExecContext(ctx, "DELETE FROM task;"); err != nil {
		t.Logf("failed to initialize task: %v", err)
	}
	c := clock.FixedClocker{}
	wants := entity.Tasks{
		{
			Title: "want task 1", Status: "todo",
			Created: c.Now(), Modified: c.Now(),
		},
		{
			Title: "want task 2", Status: "todo",
			Created: c.Now(), Modified: c.Now(),
		},
		{
			Title: "want task 3", Status: "done",
			Created: c.Now(), Modified: c.Now(),
		},
	}
	result, err := con.ExecContext(ctx,
		`INSERT INTO task (title,status,created,modified)
	VALUES
	(?,?,?,?),
	(?,?,?,?),
	(?,?,?,?);`,
		wants[0].Title, wants[0].Status, wants[0].Created, wants[0].Modified,
		wants[1].Title, wants[1].Status, wants[1].Created, wants[1].Modified,
		wants[2].Title, wants[2].Status, wants[2].Created, wants[2].Modified,
	)
	if err != nil {
		t.Fatal(err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		t.Fatal(err)
	}
	wants[0].ID = entity.TaskID(id)
	wants[1].ID = entity.TaskID(id + 1)
	wants[2].ID = entity.TaskID(id + 2)
	return wants, id
}

func TestRepository_ListTasks(t *testing.T) {
	ctx := context.Background()
	tx, err := testutil.OpenDBForTest(t).BeginTxx(ctx, nil)
	t.Cleanup(func() { _ = tx.Rollback() })
	if err != nil {
		t.Fatal(err)
	}
	wants, _ := prepareTasks(ctx, t, tx)

	sut := &Repository{}
	gots, err := sut.ListTasks(ctx, tx)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if d := cmp.Diff(gots, wants); len(d) != 0 {
		t.Errorf("differs:(-got +want\n%s", d)
	}
}

func TestRepository_ListTask(t *testing.T) {
	ctx := context.Background()
	tx, err := testutil.OpenDBForTest(t).BeginTxx(ctx, nil)
	t.Cleanup(func() { _ = tx.Rollback() })
	if err != nil {
		t.Fatal(err)
	}
	wants, id := prepareTasks(ctx, t, tx)
	want := wants[0]

	sut := &Repository{}
	gots, err := sut.ListTask(ctx, tx, id)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if d := cmp.Diff(gots, want); len(d) != 0 {
		t.Errorf("differs:(-got +want\n%s", d)
	}
}

// func TestRepository_AddTask(t *testing.T) {
// 	t.Parallel()
// 	ctx := context.Background()
// 	c := clock.FixedClocker{}
// 	var wantID int64 = 20
// 	okTask := &entity.Task{
// 		Title:    "ok task",
// 		Status:   "todo",
// 		Created:  c.Now(),
// 		Modified: c.Now(),
// 	}

// 	db, mock, err := sqlmock.New()
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	t.Cleanup(func() { _ = db.Close() })
// 	mock.ExpectExec(
// 		// エスケープが必要
// 		`INSERT INTO task \(title, status, created, modified\) VALUES \(\?, \?, \?, \?\)`,
// 	).WithArgs(okTask.Title, okTask.Status, c.Now(), c.Now()).
// 		WillReturnResult(sqlmock.NewResult(wantID, 1))

// 	xdb := sqlx.NewDb(db, "mysql")
// 	r := &Repository{Clocker: c}
// 	if err := r.AddTask(ctx, xdb, okTask); err != nil {
// 		t.Errorf("want no error, but got %v", err)
// 	}
// }

// データ登録してDB見るのはこっち
func TestRepository_AddTask(t *testing.T) {
	t.Parallel()
	ctx := context.Background()
	tx := testutil.OpenDBForTest(t)

	// if err != nil {
	// 	t.Fatal(err)
	// }
	c := clock.FixedClocker{}
	okTask2 := &entity.Task{
		Title:    "ok task",
		Status:   "todo",
		Created:  c.Now(),
		Modified: c.Now(),
	}

	sut := &Repository{Clocker: c}
	if err := sut.AddTask(ctx, tx, okTask2); err != nil {
		t.Errorf("want no error, but got %v", err)
	}
	num, err := sut.DeleteTask(ctx, tx, int64(okTask2.ID))

	if num != 1 {
		t.Fatalf("unexpected error")
	}

	if err != nil {
		t.Errorf("want no error, but got %v", err)
	}
}

func TestRepository_UpdateTask(t *testing.T) {
	t.Parallel()
	ctx := context.Background()
	tx, err := testutil.OpenDBForTest(t).BeginTxx(ctx, nil)

	if err != nil {
		t.Fatal(err)
	}
	c := clock.FixedClocker{}
	okTask2 := &entity.Task{
		ID:       12,
		Title:    "ok task_update",
		Status:   "done",
		Created:  c.Now(),
		Modified: c.Now(),
	}

	sut := &Repository{Clocker: c}
	if _, err := sut.UpdateTask(ctx, tx, okTask2); err != nil {
		t.Errorf("want no error, but got %v", err)
	}
	tx.Commit()
}

func TestRepository_DeleteTask(t *testing.T) {
	ctx := context.Background()
	tx, err := testutil.OpenDBForTest(t).BeginTxx(ctx, nil)
	t.Cleanup(func() { _ = tx.Rollback() })
	if err != nil {
		t.Fatal(err)
	}
	_, id := prepareTasks(ctx, t, tx)

	sut := &Repository{}
	num, err := sut.DeleteTask(ctx, tx, id)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if num != 1 {
		t.Fatalf("unexpected error")
	}
}
