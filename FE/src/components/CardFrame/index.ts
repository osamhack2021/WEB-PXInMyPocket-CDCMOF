import ComponentsFrame from "./ComponentsFrame.vue";
import Card from "./Card.vue";
import CardHash from "./CardHash.vue";
export default Card;
export { ComponentsFrame, CardHash };

export interface CardHash {
  to?: string;
  text: string;
}