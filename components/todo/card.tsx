import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { red } from "@material-ui/core/colors";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "33%",
      [theme.breakpoints.down("md")]: {
        width: "49%",
        marginBottom: "15px!important",
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        marginBottom: "15px!important",
      },
    },
    cardTitle: {
      "& > div > span": {
        fontFamily: "Calibri-Regular!important",
        textAlign: "center",
      },
    },
    cardDescription: {
      fontFamily: "Calibri-Regular",
      textAlign: "center",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

interface CardProps {
  title?: string;
  description?: string;
}

const TodoCard = React.memo((props: CardProps) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardTitle}
        action={
          <>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setOpen(true);
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={(event) => setOpen(false)}
            >
              <MenuItem key="edit">Editar</MenuItem>
              <MenuItem key="delete">Excluir</MenuItem>
            </Menu>
          </>
        }
        title={props.title}
      />
      <CardActionArea>
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.cardDescription}
            component="p"
          >
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default TodoCard;
