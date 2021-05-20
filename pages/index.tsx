import { GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/client";
import Card from "../components/todo/card";

import styles from "../styles/Home.module.scss";

export default function Home({ todos }) {
  const [session, loading] = useSession();

  return (
    <div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      <ul className={styles.todoList}>
        {todos.length > 0 ? (
          todos.map((todo) => {
            return (
              <li className={styles.todoCard} key={todo.title}>
                <Card title={todo.title} description={todo.description} />
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
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
