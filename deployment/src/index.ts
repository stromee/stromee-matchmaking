import { Config } from "@pulumi/pulumi"
import { prepareServiceRollout } from "@stromee/infrastructure-base/bin/kubernetes"

const name = "stromee-matchmaking"

export = async() => {
  const config = new Config();
  await prepareServiceRollout(name)
    .addEnvs({
      "VITE_SUPABASE_URL": config.require("supabase-url"),
      "VITE_SUPABASE_PUBLIC_KEY": config.requireSecret("supabase-public-key"),
      "VITE_LITION_BACKEND_URL": config.require("lition-backend-url"),
      "VITE_ADDRESS_SERVICE_URL": config.require("address-service-url"),
      "VITE_PRICE_LOCATOR_URL": config.require("price-locator-url"),
      "VITE_LANDING_PAGE_URL": config.require("landing-page-url"),
      "VITE_PRODUCT_CODE": config.require("product-code"),
      "VITE_CAMPAIGN_IDENTIFIER": config.require("campaign-identifier"),
    })
    .exposePort({port: 80, targetPort: 80, name: "http", subdomain: "powermatch"})
    .configureIngress(async ingress => {
      ingress.addHost("powermatch", "stromee.de")
    })
    .then(rollout => rollout.create())
}
