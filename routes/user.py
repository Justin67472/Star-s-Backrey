from flask import Blueprint, render_template

user_bp = Blueprint('user', __name__)

@user_bp.route('/homepage', methods=['GET'])
def homepage():
    return render_template('homepage.html'), 200

@user_bp.route('/muffins', methods=['GET'])
def muffins():
    return render_template('muffins.html'), 200

@user_bp.route('/doughnuts', methods=['GET'])
def doughnuts():
    return render_template('doughnuts.html'), 200

@user_bp.route('/pancakes', methods=['GET'])
def pancakes():
    return render_template('pancakes.html'), 200

@user_bp.route('/cinnamonroll', methods=['GET'])
def cinnamonroll():
    return render_template('cinnamonroll.html'), 200

@user_bp.route('/cookies', methods=['GET'])
def cookies():
    return render_template('cookies.html'), 200

@user_bp.route('/tincakes', methods=['GET'])
def tincakes():
    return render_template('tincakes.html'), 200

@user_bp.route('/fruitjuices', methods=['GET'])
def fruitjuices():
    return render_template('fruitjuices.html'), 200

@user_bp.route('/packages', methods=['GET'])
def packages():
    return render_template('packages.html'), 200

@user_bp.route('/aboutme', methods=['GET'])
def aboutme():
    return render_template('aboutme.html'), 200

@user_bp.route('/cart', methods=['GET'])
def cart():
    return render_template('cart.html'), 200

@user_bp.route('/checkout', methods=['GET'])
def checkout():
    return render_template('checkout.html'), 200