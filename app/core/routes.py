from datetime import datetime
from flask import (render_template, flash, redirect, url_for, 
    request, current_app)

from app.core import bp

@bp.route('/', methods=['GET', 'POST'])
@bp.route('/index/', methods=['GET', 'POST'])
def index():   
    return render_template('index.html', title='Home')


@bp.route('/pets/', methods=['GET', 'POST'])
def pets():
	return render_template('pets.html', title='Pets')

@bp.route('/units/', methods=['GET', 'POST'])
def units():
	return render_template('units.html', title='Units')