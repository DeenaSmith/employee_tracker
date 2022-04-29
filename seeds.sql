
INSERT INTO department (name)
VALUES
    ('Medical'),
    ('Engineering'),
    ('Flight Operations'),
    ('Command'),
    ('Security');


INSERT INTO roles (title, salary, department_id)
VALUES
    ('Medical Officer', 80000, 1),
    ('Counselor', 60000, 1),
    ('Engineer', 70000, 2),
    ('Captain', 100000, 4),
    ('Security Officer', 60000, 5),
    ('Commanding Officer', 80000, 4),
    ('Flight Officer', 60000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
    ('Jean-Luc', 'Picard', 4, NULL),
    ('William', 'Riker', 6, 4),
    ('Geordi', 'La Forge', 3, 4),
    ('Tasha', 'Yar', 5, 4),
    ('Worf', NULL, 5, 5),
    ('Beverly', 'Crusher', 1, 4),
    ('Deanna', 'Troi', 1, 4),
    ('Data', NULL, 7, 4),
    ('Wesley', 'Crusher', 7, 4);

