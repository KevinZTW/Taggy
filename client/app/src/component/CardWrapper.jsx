import Card from "./Card";
import "../css/CardWrapper.css";
export default function CardWrapper(props) {
  let list = [];
  for (let i in props.list) {
    list.push(
      <Card
        title={props.list[i].title}
        content={props.list[i].content}
        id={props.list[i].id}
        key={props.list[i].id}
      />
    );
  }

  return <div className="cardWrapper">{list}</div>;
}
