import Entity from '../../entities/Entity'

export default interface IRepository {

	find(props: { [k: string]: any }, transactionId?: string): Promise<Entity[]>

	insert(entity: Entity, transactionId?: string): Promise<string>

	update?(entity: Entity, transactionId?: string): Promise<boolean>

	delete?(id: string, transactionId?: string): Promise<boolean>


	transaction(): Promise<string>

	commit(id: string): Promise<void>

	rollback(id: string): void

	close(): Promise<void>

}