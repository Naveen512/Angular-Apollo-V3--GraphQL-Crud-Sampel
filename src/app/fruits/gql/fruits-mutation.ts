import { gql } from "apollo-angular";


export const CREATE_Fruit = gql`
mutation($name:String!, $quantity:Int!, $price: Int!){
  createFruit(name:$name, quantity: $quantity, price: $price){
    id,
    name,
    quantity,
    price
  }
}
`
export const Update_Fruit = gql`
mutation($id:ID!,$name:String!, $quantity:Int!, $price: Int!){
  updateFruit(id:$id,name:$name, quantity: $quantity, price: $price){
    id,
    name,
    quantity,
    price
  }
}
`
export const Delete_Fruit = gql`
mutation($id:ID!){
  removeFruit(id:$id){
    id
  }
}
`