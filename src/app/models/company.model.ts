import {Leads} from './../models/leads';
import {Traffic} from './../models/traffic';
import * as moment from 'moment';
export class Company {
    id: string;
    updatedAt: string;
    createdAt: string;
    name: string;
    sub_domain: string;
    GDPR: boolean;
    agency: boolean;
    api: string;
    campaign: string;
    child_intercom_id: string;
    current_referral_program: string;
    deal_refered: string;
    featureUpdated: string[];
    integration: boolean;
    is_admin_created: boolean;
    is_appsumo_created: boolean;
    is_payment_required: boolean;
    remove_leads_after_saving: boolean;
    reset_current_usage: boolean;
    reset_period: number;
    subscription_updated: string;
    parent_company: string;
    paymentFailed: boolean;
    leads: {
        total: number,
        period: string
    };
    traffic: {
        frequency: number,
        period: string
    };
    billing: Billing;
    previousPlan: {
        plan_id: string,
        subscription_status: string
    };
    addon: {
        quantity: number,
        traffic: number,
        leads: number
    };
    cancellation_request: {
        user: string,
        request_date: string,
        cancelled_by_user: boolean
    };
    cname: {
        error_url: string,
        root_url: string,
        url: string
    };
    current_limit: {
        companies: number,
        users: number,
        calcUpdate_count: number,
        calculators: number,
        traffic: number,
        leads: number
    };
    current_usage: {
        calc: number,
        total_conversion_rate: number,
        total_visits: number,
        total_leads: number,
        traffic: number,
        lead: number
    };
    global_configuration: {
        logo_url: string;
    };
    last_lead: {
        last_added: null
    };
    last_publish_app: {
        publish_date: string
    };
    promocode: string;
    referral: {
        referral_code: string,
        growsumo_url: string,
        leaddyno_url: string,
        sharing_url: string,
        referralcandy_url: string,
        is_created: boolean,
        is_referralcandy_visible: boolean,
        referral_email: string,
    };
    constructor(company) {
        if (company) {
            this.id = company._id || null;
            this.updatedAt = moment(company.updatedAt).format('MMM Do YYYY') || null;
            this.createdAt = moment(company.createdAt).format('MMM Do YYYY') || null;
            this.name = company.name || null;
            this.sub_domain = company.sub_domain || null;
            this.GDPR = company.GDPR || false;
            this.agency = company.agency || false;
            this.api = company.api;
            this.campaign = company.campaign;
            this.child_intercom_id = company.child_intercom_id || null;
            this.current_referral_program = company.current_referral_program || '';
            this.deal_refered = company.deal_refered || null;
            this.featureUpdated = company.featureUpdated || [];
            this.integration = company.integration || false;
            this.is_admin_created = company.is_admin_created || false;
            this.is_appsumo_created = company.is_appsumo_created || false;
            this.is_payment_required = company.is_payment_required || false;
            this.remove_leads_after_saving = company.remove_leads_after_saving || false;
            this.reset_current_usage = company.reset_current_usage || false;
            this.reset_period = company.request_date || 0;
            this.subscription_updated = moment(company.subscription_updated).format('MMM Do YYYY') || null;
            this.parent_company = company.parent_company || null;
            this.paymentFailed = company.paymentFailed || false;
            if (company.leads) {
              this.leads = {
                total: company.leads.total || 0,
                period: company.leads.period || null
              };
            }
            if (company.traffic) {
              this.traffic = {
                  frequency: company.traffic.frequency || 0,
                  period: company.traffic.period || null
              };
            }
            this.billing = new Billing(company.billing);
            if (company.previousPlan) {
              this.previousPlan = {
                  plan_id: company.previousPlan.plan_id,
                  subscription_status: company.previousPlan.subscription_status
              };
            }
            if (company.addon) {
              this.addon = {
                  quantity: company.addon.quantity,
                  traffic: company.addon.traffic,
                  leads: company.addon.leads
              };
            }
            if (company.cancellation_request) {
              this.cancellation_request = {
                  user: company.cancellation_request.user,
                  request_date: company.cancellation_request.request_date,
                  cancelled_by_user: company.cancellation_request.cancelled_by_user
              };
            }
            if (company.cname) {
              this.cname = {
                error_url: company.cname.error_url,
                root_url: company.cname.root_url,
                url: company.cname.url
              };
            }
            if (company.current_limit) {
              this.current_limit = {
                  companies: company.current_limit.companies,
                  users: company.current_limit.users,
                  calcUpdate_count: company.current_limit.calcUpdate_count,
                  calculators: company.current_limit.calculators,
                  traffic: company.current_limit.traffic,
                  leads: company.current_limit.leads
              };
            }
            if (company.current_usage) {
              this.current_usage = {
                calc: company.current_usage.calc,
                total_conversion_rate: company.current_usage.total_conversion_rate,
                total_visits: company.current_usage.total_visits,
                total_leads: company.current_usage.total_leads,
                traffic: company.current_usage.traffic,
                lead: company.current_usage.lead
              };
            }
            if (company.global_configuration) {
              this.global_configuration = {
                logo_url: company.global_configuration.logo_url
              };
            }
            if (company.last_lead) {
              this.last_lead = {
                  last_added: company.last_lead.last_added
              };
            }
            if (company.last_publish_app) {
              this.last_publish_app = {
                  publish_date: company.last_publish_app.publish_date
              };
            }
            this.promocode = company.promocode;
            if (company.referral) {
              this.referral = {
                  referral_code: company.referral.referral_code,
                  growsumo_url: company.referral.growsumo_url,
                  leaddyno_url: company.referral.leaddyno_url,
                  sharing_url: company.referral.sharing_url,
                  referralcandy_url: company.referral.referralcandy_url,
                  is_created: company.referral.is_created,
                  is_referralcandy_visible: company.referral.is_referralcandy_visible,
                  referral_email: company.referral.referral_email,
              };
            }
        }
    }
}
 
export class CurrentCompany {
    public _id: String;
    public id: String;
    public updatedAt: Date;
    public createdAt: Date;
    public subscription_updated: Date;
    public promocode: String;
    public name: String;
    public sub_domain: String;
    public agency: Boolean;
    public leads: Leads;
    public traffic: Traffic;
    // public user_company: UsersCompany;
    public is_admin_created: Boolean;
    public integration: Boolean;
    public current_referral_program: String;
    public api: String;
    public reset_current_usage: Boolean;
    public reset_period: Number;
    public is_appsumo_created: Boolean;
    public referral: Referral;
    public billing: Billing;
    public addon: Addon;
    public current_usage: CurrentUsage;
    public current_limit: CurrentLimit;
    public parent_company: String;
    public cname: CName;
  
    constructor(company: any) {
      if (company) {
        this.id = company._id;
        this.updatedAt = company.updatedAt;
        this.createdAt = company.createdAt;
        this.subscription_updated = company.subscription_updated;
        this.promocode = company.promocode;
        this.name = company.name;
        this.sub_domain = company.sub_domain;
        this.agency = company.agency;
        this.leads = new Leads(company.leads);
        this.traffic = new Traffic(company.traffic);
        // this.user_company = new UsersCompany(company.user_company);
        this.is_admin_created = company.is_admin_created;
        this.integration = company.integration ? company.integration : false;
        this.api = company.api;
        this.reset_current_usage = company.reset_current_usage ? company.reset_current_usage : false;
        this.is_appsumo_created = company.is_appsumo_created;
        this.reset_period = company.reset_period;
        this.current_referral_program = company.current_referral_program;
        this.referral = new Referral(company.referral);
        this.billing = new Billing(company.billing);
        this.addon = new Addon(company.addon);
        this.current_usage = new CurrentUsage(company.current_usage);
        this.current_limit = new CurrentLimit(company.current_limit);
        this.parent_company = company.parent_company;
        this.cname = new CName(company.cname);
      }
    }
  }

  export class Referral {
    public is_created: Boolean;
    public referral_email: String;
    public referralcandy_url: String;
    public leaddyno_url: String;
    public referral_code: String;
    public sharing_url: String;
    public is_referralcandy_visible: Boolean;
    public growsumo_url: string;
  
    constructor(referral: any) {
      if (referral) {
        this.is_created = referral.is_created;
        this.referral_email = referral.referral_email;
        this.referralcandy_url = referral.referralcandy_url;
        this.leaddyno_url = referral.leaddyno_url;
        this.sharing_url = referral.sharing_url;
        this.referral_code = referral.referral_code;
        this.growsumo_url = referral.growsumo_url;
        this.is_referralcandy_visible = referral.is_referralcandy_visible;
      }
    }
  }
  
  export class Addon {
    public quantity: any;
    public traffic: any;
    public leads: any;
  
    constructor(addon: any) {
      if (addon) {
        this.quantity = addon.quantity;
        this.traffic = addon.traffic;
        this.leads = addon.leads;
      }
    }
  }
  export class CurrentUsage {
    public traffic: any;
    public leads: any;
  
    constructor(current_usage: any) {
      if (current_usage) {
        this.traffic = current_usage.traffic;
        this.leads = current_usage.leads;
      }
    }
  }
  
  export class CurrentLimit {
    public calculators: any;
    public traffic: any;
    public leads: any;
    public users: any;
    public companies: any;
  
    constructor(current_limit: any) {
      if (current_limit) {
        this.calculators = current_limit.calculators;
        this.traffic = current_limit.traffic;
        this.leads = current_limit.leads;
        this.users = current_limit.users;
        this.companies = current_limit.companies;
      }
    }
  }
  
  export class CName {
    public url: String;
    public root_url: String;
    public error_url: String;
  
    constructor(cname: any) {
      if (cname) {
        this.url = cname.url;
        this.root_url = cname.root_url;
        this.error_url = cname.error_url;
      }
    }
  }
  

export class Billing {
    chargebee_customer_id: string;
    chargebee_plan_id: string;
    chargebee_subscription_id: string;
    chargebee_subscription_status: string;
    configured: boolean;
    customer_card_status: string;
    plan_price: number;
    revenue_till_date: number;
    stripe_customer_id: string;
    subscription: {
        percent_cycle_over: number,
        billing_unit: string,
        end: string,
        start: string
    };
    user: string;
    constructor(billing) {
        if (billing) {
            this.chargebee_customer_id = billing.chargebee_customer_id || null;
            this.chargebee_plan_id = billing.chargebee_plan_id || null;
            this.chargebee_subscription_id = billing.chargebee_subscription_id || null;
            this.chargebee_subscription_status = billing.chargebee_subscription_status || null;
            this.configured = billing.configured || false;
            this.customer_card_status = billing.customer_card_status || null;
            this.plan_price = billing.plan_price || 0;
            this.revenue_till_date = billing.revenue_till_date || 0;
            this.stripe_customer_id = billing.stripe_customer_id || null;
            this.subscription = {
                percent_cycle_over: billing.subscription.percent_cycle_over || null,
                billing_unit: billing.subscription.billing_unit || null,
                end: moment(billing.subscription.end).format('MMM Do YYYY') || null,
                start: moment(billing.subscription.start).format('MMM Do YYYY') || null
            };
            this.user = billing.subscription.user;
        }
    }

   
}
