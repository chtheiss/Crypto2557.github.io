import json
import os
from datetime import datetime
from flask import (render_template, flash, redirect, url_for, 
    request, current_app)

from app.core import bp

@bp.route('/', methods=['GET', 'POST'])
def index():   
    return render_template('index.html', title='Home')

@bp.route('/pets/', methods=['GET', 'POST'])
def pets():
    pets_url = os.path.join(current_app.root_path, "static", "pets.json")
    pets = json.load(open(pets_url))
    return render_template('pets.html', title='Pets', pets=pets)

@bp.route('/units/', methods=['GET', 'POST'])
def units():
    return render_template('units.html', title='Units')

@bp.route('/tickets/', methods=['GET', 'POST'])
def tickets():
    units_url = os.path.join(current_app.root_path, "static", "units.json")
    units = json.load(open(units_url))
    tickets_url = os.path.join(current_app.root_path, "static", "ticket_order.json")
    tickets = json.load(open(tickets_url))
    return render_template('tickets.html', title='Tickets', units=units, tickets=tickets)