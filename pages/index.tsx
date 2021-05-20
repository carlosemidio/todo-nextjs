import { Backdrop, Fab, Fade, Modal } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { orderBy } from "lodash";
import { GetServerSideProps } from "next";
import { Component } from "react";
import Card from "../components/todo/card";
import Form from "../components/todo/form";

import styles from "../styles/Home.module.scss";

interface TodoProps {
  _id: string;
  title: string;
  description: string;
}
interface IState {
  todos: Array<TodoProps>;
  todo: TodoProps;
  lastCount: number;
  pages: number;
  loading: boolean;
  openModal: boolean;
}
interface Props {
  todos: Array<TodoProps>;
}

export default class Home extends Component<Props> {
  state: IState = {
    todos: this.props.todos,
    todo: null,
    lastCount: 0,
    pages: 10,
    loading: false,
    openModal: false,
  };

  constructor(props) {
    super(props);
    this.onDeleteTodo = this.onDeleteTodo.bind(this);
    this.handleNewTodo = this.handleNewTodo.bind(this);
    this.handleEditTodo = this.handleEditTodo.bind(this);
    this.handleUpdateTodo = this.handleUpdateTodo.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ openModal: true, todo: null });
  }

  handleCloseModal() {
    this.setState({ openModal: false });
  }

  fetchMoreData = () => {
    this.setState({
      loading: true,
    });

    setTimeout(() => {
      this.getTodos();
    }, 1500);
  };

  async getTodos() {
    await this.setState({
      lastCount: this.state.todos.length,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todos?from=${this.state.todos.length}&pages=${this.state.pages}`
    );
    const todos = await res.json();

    this.setState({
      todos: this.state.todos.concat(todos),
      loading: false,
    });
  }

  async handleNewTodo(_todo) {
    await this.setState({
      todos: [_todo].concat(this.state.todos),
      openModal: false,
    });
  }

  async handleEditTodo(_todo) {
    await this.setState({
      todo: _todo,
      openModal: true,
    });
  }

  async handleUpdateTodo(_todo) {
    this.setState({
      todos: this.state.todos.filter((item) => {
        if (item._id !== _todo._id) {
          return item;
        }
      }),
      todo: null,
    });

    this.handleNewTodo(_todo);
  }

  async onDeleteTodo(todo) {
    await this.setState({
      todos: this.state.todos.filter(function (_todo) {
        return _todo._id !== todo._id;
      }),
      lastCount: this.state.lastCount - 1,
    });
  }

  render() {
    const todoList = orderBy(
      this.state.todos,
      ["id", "createdAt"],
      ["desc", "desc"]
    ).map((todo) => (
      <li className={styles.todoCard} key={todo._id}>
        <Card
          title={todo.title}
          description={todo.description}
          todo={todo}
          editTodo={this.handleEditTodo}
          onDeleteTodo={this.onDeleteTodo}
          handleOpen={this.handleOpenModal}
        />
      </li>
    ));

    return (
      <div>
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={styles.modal}
            open={this.state.openModal}
            onClose={this.handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <>
              <Fade in={this.state.openModal}>
                <Form
                  handleNewTodo={this.handleNewTodo}
                  handleUpdateTodo={this.handleUpdateTodo}
                  handleCloseModal={this.handleCloseModal}
                  id={this.state.todo && this.state.todo._id}
                  title={this.state.todo && this.state.todo.title}
                  description={this.state.todo && this.state.todo.description}
                />
              </Fade>
            </>
          </Modal>
        </div>
        <ul className={styles.todoList}>
          {this.state.todos.length > 0 ? todoList : <></>}
        </ul>
        <Fab
          color="secondary"
          aria-label="add"
          className={styles.fab}
          onClick={this.handleOpenModal}
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/todo/list`);
  const data = await res.json();

  return {
    props: {
      todos: data.todos,
    },
  };
};
