import Adapt from 'core/js/adapt';
import device from 'core/js/device';
class MobileInstruction extends Backbone.Controller {
  initialize() {
    this.listenTo(Adapt, {
      'app:dataReady': this._onDataReady
    });
  }

  _onDataReady() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const elementTypes = [
      'menu',
      'page',
      'article',
      'block',
      'component'
    ];

    const elementEventNames = elementTypes
      .concat([''])
      .join('View:postRender ');

    this.listenTo(Adapt, elementEventNames, this.renderView);

    this.listenTo(Adapt, {
      'device:changed device:resize': this.reRender
    });
  }

  renderView(view) {
    const model = view.model;
    if (!this.checkIsEnabled(model)) return;
    const _mobileInstruction = model.get('_mobileInstruction');
    const $el = _.isEmpty(_mobileInstruction._selector) ? view.$el : view.$el.find(_mobileInstruction._selector);
    this.renderMobileInstruction(model, $el);
  }

  renderMobileInstruction(model, el) {
    const instruction = model.get('instruction');
    const _mobileInstruction = model.get('_mobileInstruction');
    const mobileInstruction = _mobileInstruction.instruction;
    const sizedInstruction = (mobileInstruction && device.screenSize !== 'large') ? mobileInstruction : instruction;
    el.html(sizedInstruction);
  }

  reRender() {
    const model = Adapt.findById(Adapt.location._currentId);
    if (model.get('_type') === 'course') {
      if (!this.checkIsEnabled(model)) return;
      const _mobileInstruction = model.get('_mobileInstruction');
      const el = _.isEmpty(_mobileInstruction._selector) ? $('.menu__instruction-inner') : $(_mobileInstruction._selector);
      this.renderMobileInstruction(model, el);
    } else {
      if (!this.checkIsEnabled(model)) return;
      const _mobileInstruction = model.get('_mobileInstruction');
      const el = _.isEmpty(_mobileInstruction._selector) ? $('.page__instruction-inner') : $(_mobileInstruction._selector);
      this.renderMobileInstruction(model, el);
      const allDescendants = model.getAllDescendantModels(true);
      allDescendants.forEach(descendant => {
        if (!this.checkIsEnabled(descendant)) return;
        const _mobileInstruction = descendant.get('_mobileInstruction');
        const el = _.isEmpty(_mobileInstruction._selector) ? $(descendant.get('_type') + '__instruction-inner') : $(_mobileInstruction._selector);
        this.renderMobileInstruction(descendant, el);
      });
    }
  }

  checkIsEnabled(model) {
    const _config = model.get('_mobileInstruction');
    if (!_config || !_config._isEnabled) return false;
    return true;
  }
}
export default new MobileInstruction();
