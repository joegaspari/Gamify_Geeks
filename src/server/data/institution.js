import Institution from '../models/institution.js';
import sequelize from '../models/database.js';

export async function findByInstitutionCode(institutionCode) {
    return Institution.findOne({ where: { institutionCode } });
}
export async function findByInstitutionId(institutionId) {
    return Institution.findOne({ where: {institutionId } });
}
