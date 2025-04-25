"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var drizzle_seed_1 = require("drizzle-seed");
var schema_1 = require("./schema");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
                    return [4 /*yield*/, (0, drizzle_seed_1.seed)(db, { users: schema_1.users, patients: schema_1.patients, doctors: schema_1.doctors, appointments: schema_1.appointments, services: schema_1.services, payments: schema_1.payments, patientBills: schema_1.patientBills, workingDays: schema_1.workingDays, diagnoses: schema_1.diagnoses, vitalSigns: schema_1.vitalSigns, labTests: schema_1.labTests, medicalRecords: schema_1.medicalRecords, auditLogs: schema_1.auditLogs, ratings: schema_1.ratings })
                            .refine(function (f) {
                            var _a;
                            return ({
                                users: {
                                    count: 10,
                                    columns: {
                                        id: f.uuid(),
                                        first: f.firstName(),
                                        email: f.email(),
                                        password: f.string({ length: 10 }),
                                        status: f["enum"](["PENDING", "APPROVED", "REJECTED"]),
                                        role: f["enum"](["USER", "ADMIN", "NURSE", "DOCTOR", "LAB_TECHNICIAN", "PATIENT", "CASHIER"]),
                                        lastActivityDate: f.date(),
                                        createdAt: f.timestamp()
                                    }
                                },
                                patients: {
                                    count: 20,
                                    columns: {
                                        id: f.uuid(),
                                        first_name: f.firstName(),
                                        last_name: f.lastName(),
                                        date_of_birth: f.date(),
                                        gender: f["enum"](["MALE", "FEMALE"]),
                                        phone: f.phoneNumber(),
                                        email: f.email(),
                                        address: f.address(),
                                        marital_status: f["enum"](["single", "married"]),
                                        emergency_contact_name: f.fullName(),
                                        emergency_contact_number: f.phoneNumber(),
                                        relation: f.word(),
                                        blood_group: f["enum"](["A+", "O-", "B+", "AB+"]),
                                        allergies: f.loremIpsum(),
                                        medical_condition: f.loremIpsum(),
                                        medical_history: f.loremIpsum(),
                                        insurance_provider: f.companyName(),
                                        insurance_number: f.string({ length: 10 }),
                                        privacy_consent: f.boolean(),
                                        service_consent: f.boolean(),
                                        disclosure_consent: f.boolean(),
                                        img: f.imageUrl(),
                                        createdAt: f.timestamp(),
                                        updatedAt: f.timestamp()
                                    }
                                },
                                doctors: {
                                    count: 5,
                                    columns: {
                                        id: f.uuid(),
                                        email: f.email(),
                                        name: f.fullName(),
                                        specialization: f.word(),
                                        license_number: f.string({ length: 10 }),
                                        phone: f.phoneNumber(),
                                        address: f.address(),
                                        department: f.word(),
                                        img: f.imageUrl(),
                                        colorCode: f.color(),
                                        availability_status: f["enum"](["Available", "Unavailable"]),
                                        type: f["enum"](["FULL", "PART"]),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                services: {
                                    count: 10,
                                    columns: {
                                        id: f.uuid(),
                                        service_name: f.word(),
                                        description: f.loremIpsum(),
                                        price: f.number({ min: 100, max: 1000 }),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                appointments: {
                                    count: 30,
                                    columns: {
                                        id: f.uuid(),
                                        patient_id: f.uuid(),
                                        doctor_id: f.uuid(),
                                        appointment_date: f.date(),
                                        time: f.time(),
                                        status: f["enum"](["scheduled", "completed", "cancelled", "pending"]),
                                        type: f.word(),
                                        note: f.loremIpsum(),
                                        reason: f.loremIpsum(),
                                        cancellationReason: f.loremIpsum(),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                payments: {
                                    count: 20,
                                    columns: {
                                        id: f.uuid(),
                                        bill_id: f.uuid(),
                                        patient_id: f.uuid(),
                                        appointment_id: f.uuid(),
                                        bill_date: f.timestamp(),
                                        payment_date: f.timestamp(),
                                        discount: f.number({ min: 0, max: 100 }),
                                        total_amount: f.number({ min: 500, max: 5000 }),
                                        amount_paid: f.number({ min: 0, max: 5000 }),
                                        role: f["enum"](["ADMIN"]),
                                        payment_status: f["enum"](["PAID", "UNPAID", "PART"]),
                                        payment_method: f["enum"](["CASH", "CARD"]),
                                        receipt_number: f.number({ min: 1000, max: 9999 }),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                patientBills: {
                                    count: 20,
                                    columns: {
                                        id: f.uuid(),
                                        bill_id: f.uuid(),
                                        service_id: f.uuid(),
                                        service_date: f.timestamp(),
                                        quantity: f.number({ min: 1, max: 5 }),
                                        unit_cost: f.number({ min: 100, max: 1000 }),
                                        total_cost: f.number({ min: 100, max: 5000 }),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                workingDays: {
                                    count: 5,
                                    columns: {
                                        id: f.uuid(),
                                        doctor_id: f.uuid(),
                                        day: f["enum"](["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
                                        start_time: f.time(),
                                        close_time: f.time(),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                diagnoses: {
                                    count: 10,
                                    columns: {
                                        id: f.uuid(),
                                        medical_id: f.uuid(),
                                        doctor_id: f.uuid(),
                                        symptoms: f.loremIpsum(),
                                        diagnosis: f.loremIpsum(),
                                        notes: f.loremIpsum(),
                                        prescribed_medications: f.loremIpsum(),
                                        follow_up_plan: f.loremIpsum(),
                                        created_at: f.timestamp(),
                                        updated_at: f.timestamp()
                                    }
                                },
                                vitalSigns: {
                                    count: 10,
                                    columns: {
                                        id: f.uuid(),
                                        medical_id: f.uuid(),
                                        body_temperature: f.number({ min: 36, max: 38 }),
                                        systolic: f.number({ min: 90, max: 180 }),
                                        diastolic: f.number({ min: 60, max: 120 }),
                                        heartRate: f.number({ min: 60, max: 100 }),
                                        respiratory_rate: f.number((_a = { min: 12, max: 20, contentReference: contentReference }, _a[oaicite] = 0, _a), { index: index })
                                    }
                                }
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
