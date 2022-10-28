import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'price' })
    price: number

    @Column({ name: 'imageUrl' })
    imageUrl: string

    @Column({ name: 'description' })
    description: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date
}
