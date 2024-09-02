from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Lesson(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)
    parent_id = db.Column(db.String, db.ForeignKey('lesson.id'), nullable=True)
    position_x = db.Column(db.Float, nullable=False)
    position_y = db.Column(db.Float, nullable=False)
    starting_warren = db.Column(db.String, nullable=False)

    children = db.relationship('Lesson', backref=db.backref('parent', remote_side=[id]))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'parent_id': self.parent_id,
            'position_x': self.position_x,
            'position_y': self.position_y,
            'starting_warren': self.starting_warren,
            'children': [child.id for child in self.children]
        }