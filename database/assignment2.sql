-- Assignment 2 SQL Script
-- Add your SQL code here
INSERT INTO "account"(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update account type to Admin for Tony Stark
UPDATE "account"
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Delete Tony Stark from account table
DELETE FROM "account"
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
--  Update inv_description for GM Hummer
UPDATE "inventory"
SET inv_description = REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Select inv_make and inv_model for all 'Sport' classification vehicles
SELECT inv_make,
    inv_model
FROM inventory
WHERE classification_id = '2';
-- Update inv_image and inv_thumbnail paths to include 'vehicles' subdirectory
UPDATE "inventory"
SET inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');