import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
} from "@material-ui/core";
import { withFormik, FormikProps } from "formik";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
  },
  container: {
    display: "Flex",
    justifyContent: "center",
    maxHeight: "100%",
    width: 600,
    overflowY: "scroll",
  },
  formControl: {
    marginTop: theme.spacing(2),
  },
  actions: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  errorMessage: {
    color: "#ff1744",
    margin: 0,
    fontSize: "0.75rem",
    marginTop: "3px",
    textAlign: "left",
    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },
}));

var titles = [];

const validationsForm = {
  title: yup
    .string()
    .required("O título é obrigatório")
    .test("unique", "O título informado já existe!", function (value) {
      return !titles.includes(value);
    }),
  description: yup.string(),
};

interface FormValues {
  todo_id?: string;
  title?: string;
  description?: string;
  handleNewTodo: (todo: Object) => void;
  handleUpdateTodo: (todo: Object) => void;
  handleCloseModal: () => void;
}

const form = (props: FormikProps<FormValues>) => {
  const {
    values,
    setFieldValue,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleCloseModal,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit}>
        <Card className={classes.card}>
          <CardContent>
            <TextField
              id="title"
              label="Título"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.title ? errors.title : ""}
              error={touched.title && Boolean(errors.title)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="description"
              label="Descrição"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.description ? errors.description : ""}
              error={touched.description && Boolean(errors.description)}
              multiline
              rows={6}
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Salvar
            </Button>
            <Button color="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

// The type of props MyForm receives
interface MyFormProps {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  handleNewTodo: (todo: Object) => void;
  handleUpdateTodo: (todo: Object) => void;
  handleCloseModal: () => void;
}

const Form = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      id: props.id || "",
      title: props.title || "",
      description: props.description || "",
      handleNewTodo: props.handleNewTodo,
      handleUpdateTodo: props.handleUpdateTodo,
      handleCloseModal: props.handleCloseModal,
    };
  },

  validationSchema: yup.object().shape(validationsForm),

  handleSubmit: (values, { props, setSubmitting, validateForm }) => {
    const { handleNewTodo, handleUpdateTodo, id } = props;

    setTimeout(async () => {
      // submit to the server

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      if (id == undefined) {
        fetch("http://localhost:3000/api/todo/store", requestOptions).then(
          async (response) => {
            const data = await response.json();

            handleNewTodo(data.todo);
          }
        );
      } else {
        fetch(
          `http://localhost:3000/api/todo/update/${id}`,
          requestOptions
        ).then(async (response) => {
          const data = await response.json();

          handleUpdateTodo(data.todo);
        });
      }

      setSubmitting(false);
    }, 1000);
  },
})(form);

export default Form;
