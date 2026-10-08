import { schema } from '../../lib/schema.js';

const section = (id, title, keys, media = false) => ({ id, title, keys, media });

const layouts = {
  Clients: [
    section('contact', 'Contact details', [
      'client_id',
      'full_name',
      'phone',
      'email',
      'preferred_language',
      'lead_source',
      'campaign_reference',
      'preferred_channel',
      'contact_permission',
      'date_added',
    ]),
    section('requirements', 'Property requirements', [
      'client_type',
      'buy_rent',
      'emirate',
      'preferred_communities',
      'property_type',
      'bedrooms',
      'target_date',
      'purchase_rental_purpose',
      'must_have_criteria',
    ]),
    section('finance', 'Budget & financing', [
      'minimum_budget_aed',
      'maximum_budget_aed',
      'payment_method',
      'finance_type',
      'mortgage_stage',
      'funds_confirmed',
    ]),
    section('qualification', 'Qualification & progress', [
      'lead_stage',
      'priority',
      'decision_maker',
      'buying_moving_urgency',
      'primary_objection',
      'lead_quality_score_100',
      'last_qualified_on',
      'relationship_status',
    ]),
    section('relationship', 'Relationships & notes', [
      'referred_by_client_id',
      're_engage_date',
      'lost_on',
      'recontact_possible',
      'lost_reason',
      'notes',
    ]),
  ],
  Properties: [
    section('basics', 'Basic details', [
      'property_id',
      'listing_title',
      'contact_id',
      'sale_rental',
    ]),
    section('specifications', 'Location & specifications', [
      'emirate',
      'community',
      'building_project',
      'unit_reference',
      'property_type',
      'bedrooms',
      'bathrooms',
      'area_sq_ft',
      'parking_spaces',
      'ready_off_plan',
      'furnishing',
    ]),
    section('pricing', 'Pricing & availability', [
      'price_annual_rent_aed',
      'price_basis',
      'rental_cheques',
      'deposit_aed',
      'available_from',
      'listing_status',
      'minimum_stay_nights',
      'maximum_guests',
      'last_verified',
    ]),
    section(
      'presentation',
      'Photos & presentation',
      [
        'amenities',
        'property_description',
        'key_selling_points',
        'virtual_tour_url',
        'floor_plan_url',
      ],
      true,
    ),
    section('documents', 'Listing & documents', [
      'listing_authorization',
      'permit_reference',
      'permit_expiry',
      'listing_url',
      'photos_documents_url',
      'viewing_instructions',
      'notes',
    ]),
  ],
  Deals: [
    section('basics', 'Deal details', [
      'deal_id',
      'client_id',
      'property_id',
      'sale_rental',
      'deal_stage',
      'pipeline_type',
      'opened_date',
      'target_close_date',
      'closed_date',
    ]),
    section('commission', 'Commission & payments', [
      'agreed_value_aed',
      'fee_basis',
      'fee_rate',
      'fixed_fee_aed',
      'partner_share',
      'your_share',
      'earned_date',
      'payment_due',
      'fee_received_aed_ex_vat',
    ]),
    section('progress', 'Progress & next action', [
      'pipeline_milestone',
      'current_blocker',
      'next_deal_action',
      'next_action_due',
      'outcome_reason',
      'lost_cancelled_reason',
    ]),
    section('documents', 'Documents & notes', ['document_status', 'documents_url', 'notes']),
  ],
  'Interaction log': [
    section('conversation', 'Conversation details', [
      'log_id',
      'contacted_on_uae_time',
      'client_id',
      'channel',
      'direction',
      'conversation_topic',
      'property_id_optional',
      'deal_id_optional',
    ]),
    section('needs', 'Needs & objections', [
      'conversation_summary_client_needs',
      'objection_category',
      'exact_objection_concern',
      'commitment_made',
    ]),
    section('follow-up', 'Follow-up action', ['next_action', 'action_due', 'action_status']),
  ],
  'Client care': [
    section('relationship', 'Relationship & touchpoint', [
      'care_id',
      'client_id',
      'touchpoint_type',
      'property_id_optional',
      'last_contact',
      'client_relationship',
      'preferences_interests',
    ]),
    section('follow-up', 'Follow-up & referrals', [
      'next_contact',
      'task_status',
      'referral_outcome',
      'referred_client_id',
      'conversation_notes',
    ]),
  ],
};

/** Resolve workbook fields once each, including future fields without silently dropping them. */
export function recordFormSections(module) {
  const fields = schema(module).filter((field) => !field.calculated);
  const byKey = new Map(fields.map((field) => [field.key, field]));
  const sections = (layouts[module] || []).map(({ keys, ...definition }) => ({
    ...definition,
    fields: keys.flatMap((key) => {
      const field = byKey.get(key);
      byKey.delete(key);
      return field ? [field] : [];
    }),
  }));
  const remaining = [...byKey.values()];
  for (let index = 0; index < remaining.length; index += 10) {
    sections.push({
      id: `additional-${index / 10}`,
      title: sections.length ? 'Additional details' : 'Record information',
      fields: remaining.slice(index, index + 10),
      media: false,
    });
  }
  return sections;
}

export function errorSectionIndex(sections, errors) {
  return sections.findIndex((section) => section.fields.some((field) => errors[field.key]));
}
