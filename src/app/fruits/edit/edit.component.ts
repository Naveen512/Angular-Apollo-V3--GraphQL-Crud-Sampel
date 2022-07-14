import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Fruits } from '../fruits';
import { Update_Fruit } from '../gql/fruits-mutation';
import { GET_Fruits, GET_Search } from '../gql/fruits-query';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {}

  fruitForm: Fruits = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      var id = Number(params.get('id'));
      this.getById(id);
    });
  }

  getById(id: number) {
    this.apollo
      .watchQuery<{ allFruits: Fruits[] }>({
        query: GET_Search,
        variables: { fruitFilter: { id } },
      })
      .valueChanges.subscribe(({ data }) => {
        var fruritById = data.allFruits[0];
        this.fruitForm = {
          id: fruritById.id,
          name: fruritById.name,
          price: fruritById.price,
          quantity: fruritById.quantity,
        };
      });
  }

  update() {
    this.apollo
      .mutate<{ updateFruit: Fruits }>({
        mutation: Update_Fruit,
        variables: {
          name: this.fruitForm.name,
          price: this.fruitForm.price,
          quantity: this.fruitForm.quantity,
          id: this.fruitForm.id,
        },
        update: (store, { data }) => {
          if (data?.updateFruit) {
            var allData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_Fruits,
            });

            if (allData && allData?.allFruits?.length > 0) {
              var newData: Fruits[] = [...allData.allFruits];
              newData = newData.filter((_) => _.id !== data.updateFruit.id);
              newData.unshift(data.updateFruit);

              store.writeQuery<{ allFruits: Fruits[] }>({
                query: GET_Fruits,
                data: { allFruits: newData },
              });
            }
          }
        },
      })
      .subscribe(({ data }) => {
        this.router.navigate(['/']);
      });
  }
}
