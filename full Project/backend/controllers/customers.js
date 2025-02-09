const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// insert one customer
const createCustomer = async (req, res) => {
    const { customer_id, first_name, last_name, address, email, phone_number } = req.body;

    try {
        // สร้างข้อมูลลูกค้าใหม่
        const cust = await prisma.customers.create({
            data: {
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });

        // ส่งการตอบกลับเมื่อสร้างลูกค้าสำเร็จ
        res.status(200).json({
            status: "ok",
            message: `User with ID = ${cust.customer_id} is created` // ส่ง ID ที่ถูกสร้างกลับไป
        });
    } catch (err) {
        // จัดการข้อผิดพลาด
        res.status(500).json({
            status: "error",
            message: "Failed to create user",
            error: err.message
        });
    }
};

//get all customer
const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany()
    res.json(custs)
}

//delete customer
const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        //ตรวจสอบว่ามีลูกค้าที่ต้องการหรือไม่่
        const existingCustomer = await prisma.customers.findUnique({
            where: {
                customer_id: Number(id), //ตรวจสอบว่ามั id ลูกค้าที่ต้องการลบหรือไม่
            },
        });
        //ถ้าไม่มีลูกค้าที่ต้องการลบ
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await prisma.customers.delete({
            where: {
                customer_id: Number(id),
            },
        });

        //ส่งการตอบกลับเมื่อลบลูกค้าสำเร็จ
        res.status(500).json({
            status: "ok",
            message: `User with ID = ${id} is deleted` // ส่ง ID ที่ถูกสร้างกลับไป
        });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: err.message });

    }
};

//get Customer by id
const getCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.customers.findUnique({
            //ค้นหาข้อมูลโดยใช้ id 
            where: {
                customer_id: Number(id),
            },
        });
        if (!cust) {
            return res.status(404).json({ message: 'Customer not found' });//ภ้าไม่พบลูกค้า
        } else {
            res.status(200).json(cust);//ส่งข้อมูลลูกค้ากลับไป
        }
    } catch (err) {
        res.status(500).json(err);
    }
};


//Put in Custommer by id
const updateCustomer = async (req, res) => {
    const { first_name, last_name, address, email, phone_number } = req.body;
    const { id } = req.params; //รับค่า id จาก URL

    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (email) data.email = email;
    if (phone_number) data.phone_number = phone_number;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No data provided for update'
        });
    }
    try {
        //อัพเดทลูกค้า
        const cust = await prisma.customers.update({
            data,
            where: {
                customer_id: Number(id),
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with ID = ${id} is updated`, // ส่ง ID ที่ถูกอัพเดทกลับไป
            user: cust
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400).json({
                status: 'error',
                message: 'Email already exists.'
            });
        } else if (err.code === 'P2025') {
            //เเสดงข้อความเมื่อไม่พบข้อมูลที่ต้องการอัพเดท
            res.status(404).json({
                status: 'error',
                message: `User with ID = ${id} not found.`
            });

        } else {
            //เเสดงข้อความเมื่อเกิดข้อผิดพลาดอื่นๆ
            console.error('Update user error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Failed to update user.'
            });
        }

    }
};

module.exports = {
    createCustomer, getCustomers, deleteCustomer, getCustomer, updateCustomer
};