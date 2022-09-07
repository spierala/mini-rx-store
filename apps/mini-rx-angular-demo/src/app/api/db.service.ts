import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from '../modules/todos-shared/models/todo';
import { Product } from '../modules/products/models/product';

const INITIAL_ID = 1;

export class DbService implements InMemoryDbService {
    createDb() {
        const products: Product[] = [
            {
                id: 1,
                productName: 'Leaf Rake',
                productCode: 'GDN-0011',
                description: 'Leaf rake with 48-inch wooden handle',
                starRating: 3.2,
                price: 20,
            },
            {
                id: 2,
                productName: 'Garden Cart',
                productCode: 'GDN-0023',
                description: '15 gallon capacity rolling garden cart',
                starRating: 4.2,
                price: 30,
            },
            {
                id: 5,
                productName: 'Hammer',
                productCode: 'TBX-0048',
                description: 'Curved claw steel hammer',
                starRating: 4.8,
                price: 40,
            },
            {
                id: 8,
                productName: 'Saw',
                productCode: 'TBX-0022',
                description: '15-inch steel blade hand saw',
                starRating: 3.7,
                price: 50,
            },
            {
                id: 10,
                productName: 'Video Game Controller',
                productCode: 'GMG-0042',
                description: 'Standard two-button video game controller',
                starRating: 4.6,
                price: 60,
            },
        ];

        const todos: Todo[] = [
            {
                id: 1,
                title: 'TODO 1',
                isDone: false,
                isPrivate: true,
            },
            {
                id: 2,
                title: 'TODO 2',
                isDone: false,
            },
            {
                id: 3,
                title: 'TODO 3',
                isDone: true,
                isBusiness: true,
            },
        ];
        return { todos, products };
    }

    genId(todos: { id: number }[]): number {
        return todos.length > 0 ? Math.max(...todos.map((todo) => todo.id!)) + 1 : INITIAL_ID;
    }
}
