import { gql } from "apollo-angular";

export const GET_Fruits = gql`
query{
  allFruits{
    id,
    price,
    name,
    quantity
  }
}
`
export const GET_Search = gql`
query($fruitFilter:FruitFilter){
  allFruits(filter:$fruitFilter){
    id
    name
    price
    quantity
  }
}
`


