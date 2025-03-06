export enum Role {
    Admin = "Admin",
    Vendor = "Vendor",
    InventoryManager = "InventoryManager",
    SuperUser = "SuperUser",
}

export const roles = [
    { value: Role.Admin, label: "Admin" },
    { value: Role.Vendor, label: "Vendor" },
    { value: Role.InventoryManager, label: "Inventory Manager" },
    { value: Role.SuperUser, label: "Super User" },
];