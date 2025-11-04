const { Class, User, Course } = require('./src/models');

async function checkClassOwnership() {
  try {
    const classes = await Class.findAll({
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['title'] }
      ]
    });

    console.log('\n=== CLASES Y SUS PROFESORES ===\n');
    classes.forEach(c => {
      console.log(`Clase ID: ${c.id}`);
      console.log(`  Título: ${c.title}`);
      console.log(`  Curso: ${c.course?.title || 'N/A'}`);
      console.log(`  Profesor: ${c.teacher?.name} (${c.teacher?.email})`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkClassOwnership();
