import graphql from 'graphql';
import database from '../database.js';
import Product from '../models/Product.js';

const {products, productGroups} = database;

const {GraphQLID, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList} = graphql;

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        price: {type: GraphQLString},
        productGroup: {
            type: ProductGroupType,
            resolve(parent, args) {
                return productGroups.find(pg=> pg.id === parent.productGroupId);
            }
        }
    })
});

const ProductGroupType = new GraphQLObjectType ({
    name: 'ProductGroup',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return products.filter(p=> p.productGroupId === parent.id);
            } //Esto es una relación de uno a muchos, porque el producto solo puede tener una etiqueta y la etiqueta muchos productos
        }
    })
})
//Mutacion es cuando vas a editar o meter datos nuevos
//Resolve sirve para resolver la operación (recibe el parent y los argumentos)
//Parent es la cosa de la que nace eso, el arguments es lo que estamos metiendo dentro de la función
//OBTENER UN PRODUCTO POR ID
const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        product: { //parent es el papa de esto (en este caso product)
            type: ProductType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return products.find(p => p.id === args.id);
            },
        },
        //obtener la lista de productos
        products: {
            type: new GraphQLList(ProductType),
            resolve (parent, args){
                return products;
            }

        },
        getProductsByGroupId: {
            type: new GraphQLList(ProductType),
            args: {groupId: {type: GraphQLID}},
            resolve (parent, args){
                return products.filter(p=> p.productGroupId === args.groupId);
            }
        },
        productGroup: {
            type: ProductGroupType,
            args: {id: {type: GraphQLID}},
            resolve (parent, args){
                return productGroups.find(pg => pg.id === args.id);
            }
        },
        productGroups: {
            type: new GraphQLList (ProductGroupType),
            resolve(parent, args){
                return productGroups;
            }
        },

        //AQUI TERMINA LA CONSULTA DE OBTENER UN PRODUCTO POR ID
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: {type:GraphQLString},
                price: {type:GraphQLString},
                productGroupId: {type:GraphQLID}
            },
            resolve (parent, args) {
                let newProduct = new Product({
                    name: args.name,
                    price: args.price,
                    productGroupId: args.productGroupId,
                });
                products.push(newProduct);

                return newProduct;
            }
        }
    }
});



export default new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
})