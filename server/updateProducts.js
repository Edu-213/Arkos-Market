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
        // Buscar todas as categorias com seus departamentos
        const categories = await Category.find().populate('department');

        for (const category of categories) {
            if (category.department) {
                // Atualizar todos os produtos dessa categoria
                const result = await Product.updateMany(
                    { category: category._id }, // Produtos que pertencem a essa categoria
                    { $set: { department: category.department._id } } // Define o departamento correto
                );
                console.log(`Atualizados ${result.modifiedCount} produtos da categoria ${category.name}`);
            }
        }

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
