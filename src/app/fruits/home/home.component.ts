import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { Fruits } from '../fruits';
import { Delete_Fruit } from '../gql/fruits-mutation';
import { GET_Fruits, GET_Search } from '../gql/fruits-query';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private apollo: Apollo) {}

  allFruits$: Observable<Fruits[]> = of([]);
  searchName: string = '';

  deleteModal: any;
  idTodelete: number = 0;

  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    this.allFruits$ = this.apollo
      .watchQuery<{ allFruits: Fruits[] }>({ query: GET_Fruits })
      .valueChanges.pipe(map((result) => result.data.allFruits));
  }

  search() {
    this.allFruits$ = this.apollo
      .watchQuery<{ allFruits: Fruits[] }>({
        query: GET_Search,
        variables: { fruitFilter: { name: this.searchName } },
      })
      .valueChanges.pipe(map((result) => result.data.allFruits));
  }

  openDeleteModal(id: number) {
    this.idTodelete = id;
    this.deleteModal.show();
  }

  delete() {
    this.apollo
      .mutate<{ removeFruit: Fruits }>({
        mutation: Delete_Fruit,
        variables: {
          id: this.idTodelete,
        },
        update: (store, { data }) => {
          if (data?.removeFruit) {
            var allData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_Fruits,
            });

            if (allData && allData?.allFruits?.length > 0) {
              var newData: Fruits[] = [...allData.allFruits];
              newData = newData.filter((_) => _.id == data.removeFruit.id);

              store.writeQuery<{ allFruits: Fruits[] }>({
                query: GET_Fruits,
                data: { allFruits: newData },
              });
            }
          }
        },
      })
      .subscribe(({ data }) => {
        this.deleteModal.hide();
      });
  }
}
