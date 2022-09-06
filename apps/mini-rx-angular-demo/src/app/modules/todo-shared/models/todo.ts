export class Todo {
    id: number | undefined;
    title: string = '';
    isDone: boolean = false;
    isBusiness?: boolean;
    isPrivate?: boolean;
    tempId?: string;
}
