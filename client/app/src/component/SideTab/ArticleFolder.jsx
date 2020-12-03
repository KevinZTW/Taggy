import { TreeView } from "@material-ui/lab";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
function ArticleFolder() {
  const useStyles = makeStyles({
    root: {
      color: "white",

      flexGrow: 1,
      maxWidth: 400,
      marginBottom: "10px",
    },
  });
  const classes = useStyles();
  return (
    <TreeView
      className={classes.root}
      defaultExpanded={[""]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    ></TreeView>
  );
}
