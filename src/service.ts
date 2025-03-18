import { PrismaClient } from '@prisma/client'
import { create } from 'domain';

const prisma = new PrismaClient()


async function getAllBooks() {
    const result = await prisma.book.findMany();
    return result;
}

//READ
async function findBook(id: number) {
    const book = await prisma.book.findUnique({
        where: { id }
    })
    return book;
}

//CREATE
async function createBook(name: string, author: string) {
    return await prisma.book.create({
        data: { name, author }
    })
}

//DELETE
async function deleteBook(id: number) {
    await prisma.book.delete({
        where: { id }
    });
}

//UPDATE
async function updateBook(id: number, newName: string, newAuthor: string) {
    return await prisma.book.update({
        where: { id },
        data: { name: newName, author: newAuthor }
    })
}

const quickStart = async () => {
    // const result = await createBook("Fire and Ice", "Brandon Sanderson");
    // const result = await getAllBooks();
    // const result = await findBook(2);
    // const result = await deleteBook(1);
    // const result = await updateBook(2, "Fire and Ice", "Brandon Sanderson");
    // console.log(result);
}


quickStart();