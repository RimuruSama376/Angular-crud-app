import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  template: `
    <div class="container">
      <h2>Here is your item List:-</h2>
      <ol>
        <li *ngFor="let item of items">
          <h3 class="item-title">{{ item.name }} :-</h3>
          <span class="item-description">
            <div class="button-container">
              {{ item.description }}
              <button (click)="editItem(item)">Edit</button>
              <button (click)="deleteItem(item._id)">Delete</button>
            </div>
          </span>
        </li>
      </ol>

      <h3 *ngIf="selectedItem">Edit Item</h3>
      <div *ngIf="selectedItem">
        Name: <input [(ngModel)]="selectedItem.name" /> Description:
        <input [(ngModel)]="selectedItem.description" />
        <button (click)="saveItem()">Save</button>
      </div>

      <h3>Add New Item</h3>
      Name: <input [(ngModel)]="newItemName" /> Description:
      <input [(ngModel)]="newItemDescription" />
      <button (click)="addItem()">Add</button>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        width: 60vh;
        height: fit-content;
        background-color: #292980;
        border-radius: 15px;
      }
      h2 {
        padding-bottom: 0px;
        margin-bottom: 2px;
      }

      h3 {
        padding-bottom: 0px;
        margin-top: 0;
        margin-bottom: 2px;
      }

      span {
        margin-left: 15px;
      }

      ol {
        list-style-position: inside;
        list-style-type: decimal !important;
        padding-left: 20px !important;
      }

      li {
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      button {
        margin-top: 5px;
        margin-left: 8px;
        margin-right: 8px;
        width: fit-content;
        font-size: 12px;
        border-radius: 15px;
        border: 0px;
      }

      input {
        border-radius: 15px;
        border: 0px;
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 5px;
        padding-left: 10px;
      }
    `,
  ],
})
export class ItemListComponent implements OnInit {
  items: {
    _id: string;
    name: string;
    description: string;
  }[] = [];
  selectedItem: any = null;
  newItemName = '';
  newItemDescription = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    const apiUrl = 'http://localhost:3001/products';
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  editItem(item: any) {
    this.selectedItem = { ...item };
  }

  saveItem() {
    const apiUrl = `http://localhost:3001/products/${this.selectedItem._id}`;

    this.http.put(apiUrl, this.selectedItem).subscribe(
      (response: any) => {
        const index = this.items.findIndex(
          (item) => item._id === this.selectedItem._id
        );
        if (index !== -1) {
          // Replace the item in the items array with the updated item from the server
          this.items[index] = response;
        }
        this.selectedItem = null; // Clear the selectedItem
      },
      (error) => {
        console.error('Error updating item:', error);
        alert('Failed to update item. Please try again.');
      }
    );
  }

  deleteItem(_id: string) {
    const apiUrl = `http://localhost:3001/products/${_id}`;

    this.http.delete(apiUrl).subscribe(
      () => {
        this.items = this.items.filter((item) => item._id !== _id);
      },
      (error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    );
  }

  addItem() {
    const apiUrl = 'http://localhost:3001/products';
    const newItem = {
      name: this.newItemName,
      description: this.newItemDescription,
    };

    this.http.post(apiUrl, newItem).subscribe(
      (response: any) => {
        this.items.push(response);
        this.newItemName = '';
        this.newItemDescription = '';
        console.log(this.items);
      },
      (error) => {
        console.error('Error adding new item:', error);
        // You can also add a user-friendly error message here
        alert('Failed to add item. Please try again.');
      }
    );
  }
}
