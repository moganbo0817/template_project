import React from "react";
import { Button, DatePicker, Space, version } from "antd";
import "antd/dist/reset.css";
import Admin from "./view/Admin";
import Task from "./view/Task";
import Book from "./view/Book";
import Login from "./view/Login";
import BookDetail from "./view/BookDetail";
import TaskDetail from "./view/TaskDetail";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Login />} />
        <Route path={`/book`} element={<Book />} />
        <Route path={`/task`} element={<Task />} />
        <Route path={`/bookdetail/:id`} element={<BookDetail />} />
        <Route path={`/taskdetail/:id`} element={<TaskDetail />} />
        <Route path={`/taskdetail`} element={<TaskDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
