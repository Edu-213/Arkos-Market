const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product'); // Modelo de Produto
const Category = require('./models/Category'); // Modelo de Categoria
const SubCategory = require('./models/SubCategorySchema');
const Department = require('./models/DepartmentSchema');

// Conectar ao banco de dados
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const updateProductsDepartment = async () => {
    try {
   
        const defaultLimit = 3;
                const result = await Product.updateMany(
                    { maxPurchesedLimit: {$exists: false} }, 
                    { $set: { maxPurchesedLimit: defaultLimit } } 
                );


        console.log('Todos os produtos foram corrigidos!');
    } catch (error) {
        console.error('Erro ao atualizar os produtos:', error);
    } finally {
        mongoose.connection.close(); // Fecha a conexão após a execução
    }
};

// Rodar a função
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Conectado ao MongoDB');
            return updateProductsDepartment();
        })
        .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
}
